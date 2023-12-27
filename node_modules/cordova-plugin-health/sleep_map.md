
Android sleep stages are listed [here](https://developers.google.com/android/reference/com/google/android/gms/fitness/data/SleepStages).
HealthKit sleep stages are listed [here](https://developer.apple.com/documentation/healthkit/hkcategoryvaluesleepanalysis)

| sleep stage name | Fit equivalent | HealthKit equivalent |
|------------------|----------------|----------------------|
|	sleep      	   |   SLEEP        | HKCategoryValueSleepAnalysisAsleep or HKCategoryValueSleepAnalysisAsleepCore or HKCategoryValueSleepAnalysisAsleepUnspecified	|
|	sleep.light    |	SLEEP_LIGHT	| 	HKCategoryValueSleepAnalysisAsleepCore |
|	sleep.deep     |	SLEEP_DEEP	| 	HKCategoryValueSleepAnalysisAsleepDeep |
|	sleep.rem      |	SLEEP_REM	| 	HKCategoryValueSleepAnalysisAsleepREM |
|	sleep.inBed    |	AWAKE	|	HKCategoryValueSleepAnalysisInBed	|
|	sleep.awake    |	AWAKE	|	HKCategoryValueSleepAnalysisAwake	|
|	sleep.outOfBed |	OUT_OF_BED	|	HKCategoryValueSleepAnalysisAwake	|
