import type { StateHealthData } from "@/types"

export const stateHealthData: StateHealthData[] = [
  { state: "Testland A", abbreviation: "TA", maternalMortality: 12.0, blackMaternalMortality: 22.0, obRatio: 6.0 },
  { state: "Testland B", abbreviation: "TB", maternalMortality: 14.5, blackMaternalMortality: 25.5, obRatio: 5.2 },
  { state: "Testland C", abbreviation: "TC", maternalMortality: 9.8, blackMaternalMortality: 18.3, obRatio: 7.1 },
  { state: "Testland D", abbreviation: "TD", maternalMortality: 20.4, blackMaternalMortality: 34.0, obRatio: 4.9 },
  { state: "Testland E", abbreviation: "TE", maternalMortality: 16.2, blackMaternalMortality: 28.7, obRatio: 6.6 },
  { state: "Testland F", abbreviation: "TF", maternalMortality: 11.1, blackMaternalMortality: 19.9, obRatio: 8.0 },
  { state: "Testland G", abbreviation: "TG", maternalMortality: 23.0, blackMaternalMortality: 40.2, obRatio: 5.5 },
  { state: "Testland H", abbreviation: "TH", maternalMortality: 7.5, blackMaternalMortality: 14.0, obRatio: 9.3 },
  { state: "Testland I", abbreviation: "TI", maternalMortality: 18.7, blackMaternalMortality: 31.6, obRatio: 6.8 },
  { state: "Testland J", abbreviation: "TJ", maternalMortality: 13.3, blackMaternalMortality: 23.4, obRatio: 7.4 },
  { state: "Testland K", abbreviation: "TK", maternalMortality: 15.9, blackMaternalMortality: 27.1, obRatio: 6.2 },
  { state: "Testland L", abbreviation: "TL", maternalMortality: 10.7, blackMaternalMortality: 17.8, obRatio: 8.6 },
]
export const nationalAverage = {
  maternalMortality: 23.5,
  blackMaternalMortality: 49.5,
  whiteMaternalMortality: 19.1,
  hispanicMaternalMortality: 16.9,
}
