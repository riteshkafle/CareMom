from agent_core import Orchestrator

def run_test():
    print("Initializing Orchestrator...")
    orchestrator = Orchestrator()
    
    test_query = "Is it safe to take Tylenol while in my second trimester?"
    user_id = "123e4567-e89b-12d3-a456-426614174000"
    
    print(f"Testing Query: {test_query}")
    print("-" * 50)
    
    # Run the request
    response = orchestrator.handle_request(user_id, test_query)
    
    print("-" * 50)
    print("Final Agent Response:")
    print(response)

if __name__ == "__main__":
    run_test()
