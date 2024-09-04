# PF1e CR in Combat Tracker
Calculates the approximate CR, APL, and difficulty for actors in the combat encounter

Approximate CR is calculated from NPC, Trap, and Haunt actors with the "Hostile" disposition.
There is a setting to include actors with the "Secret" disposition

APL is calculated from PC actors with the "Friendly" disposition

Difficulty is defined by table 12-1 [here](https://aonprd.com/Rules.aspx?ID=252) with Trivila added as APL-2

## Known Issues

- CRs of less than 1 will show as 0 instad of 1/2, 1/3, 1/4, etc
- Changing the token disposition after adding it to the encounter won't update the CR or APL, re-add the token to update