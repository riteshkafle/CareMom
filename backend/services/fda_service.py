import urllib.request
import urllib.parse
import urllib.error
import json
from typing import Optional

def search_drug_label(drug_name: str) -> Optional[dict]:
    """
    Searches the openFDA API for a drug by name (brand or generic) and 
    extracts the pregnancy-related warnings, general warnings, and active ingredient.
    """
    # Replace spaces with + for the API query
    query_name = drug_name.replace(" ", "+")
    
    # OpenFDA Drug Label API endpoint
    # We search the `openfda.brand_name` or `openfda.generic_name` fields
    url = f"https://api.fda.gov/drug/label.json?search=openfda.brand_name:\"{query_name}\"+openfda.generic_name:\"{query_name}\"&limit=1"
    
    try:
        print(f"   [FDA] Querying openFDA API for: '{query_name}'...")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status != 200:
                return None
            data = json.loads(response.read().decode())
            
        if not data.get("results"):
            return None
            
        result = data["results"][0]
        
        # Extract the fields we care about
        pregnancy_warning = result.get("pregnancy_or_breast_feeding", [""])[0]
        warnings = result.get("warnings", [""])[0]
        boxed_warning = result.get("boxed_warning", [""])[0]
        active_ingredient = result.get("openfda", {}).get("generic_name", ["Unknown"])[0]
        
        # Sometimes pregnancy is buried in specific populations
        specific_populations = result.get("use_in_specific_populations", [""])[0]
        
        print(f"   [FDA] Found label for active ingredient: {active_ingredient}")
        
        # Generate a link to the FDA's "Information by Drug Class" pages based on the main active ingredient
        primary_ingredient = "Unknown"
        if isinstance(active_ingredient, str) and active_ingredient != "Unknown":
            # Just take the first ingredient if there are multiple, lowercase, and replace spaces with hyphens
            primary_ingredient = active_ingredient.lower().split(" and ")[0].strip().replace(" ", "-")
            user_facing_url = f"https://www.fda.gov/drugs/information-drug-class/{primary_ingredient}"
        else:
            # Fallback if no active ingredient is found
            route_name = query_name.lower().replace(" ", "-")
            user_facing_url = f"https://www.fda.gov/drugs/information-drug-class/{route_name}"
        
        
        return {
            "source_url": user_facing_url,
            "query_name": drug_name,
            "active_ingredient": active_ingredient,
            "pregnancy_warning": pregnancy_warning,
            "general_warnings": warnings,
            "boxed_warning": boxed_warning,
            "specific_populations": specific_populations
        }

    except Exception as e:
        print(f"Error querying openFDA: {e}")
        return None
