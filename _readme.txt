Card.js Javascript library
============================================
It contains most of the routines needed to simulate Texas Hold'em and probably other similar card games. 
Cards are represented in binary for speed. The shuffler uses a Fisher-Yates (Knuth) shuffle algorithm (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
Coded / compiled by Adam Moore; Chat GPT-4 assisted.

Occurrence Demo
============================================
Simulates Texas Hold'em deals and compares the empirical occurrence of each possible hand rank with the theoretical
chances.

Range Race
============================================
Simulates Texas Hold'em games of Hero vs Villain(s), up to 9 oppenents. Each Villain plays the same range.
Each player with an eligible hand goes all the way to showdown. An eligible game only includes deals where 
the Hero is dealt their range and at least one Villain is dealt a hand from the Villain range. 

The range buttons show pre-selected ranges base on standard RFI charts.

The Results illustrate the occurrence of the Hero's hands, as a ratio of the total eligible games, as well
as the win rate out of all eligible games. Stop the simulator and roll over any result button for explicit
results. Otherwise, occurrence is indicated by opacity and win rate by a partial fill.

