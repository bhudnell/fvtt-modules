const CFG = {
  id: "pf1-combat-tracker-cr",
};

const actorTypesWithCR = ["npc", "haunt", "trap"];
const allyDispositions = [CONST.TOKEN_DISPOSITIONS.FRIENDLY];

const difficulties = [
  {
    label: "CombatTrackerCr.Difficulty.Trivial",
    style: "background-color: darkgreen;",
  },
  {
    label: "CombatTrackerCr.Difficulty.Easy",
    style: "background-color: green;",
  },
  {
    label: "CombatTrackerCr.Difficulty.Average",
    style: "background-color: darkgrey;",
  },
  {
    label: "CombatTrackerCr.Difficulty.Challenging",
    style: "background-color: orange;",
  },
  {
    label: "CombatTrackerCr.Difficulty.Hard",
    style: "background-color: orangered;",
  },
  {
    label: "CombatTrackerCr.Difficulty.Epic",
    style: "background-color: red;",
  },
];

const crExpLevels = [...pf1.config.CR_EXP_LEVELS];
for (let i = 0; i < 10; i++) {
  const last2 = crExpLevels.slice(-2);
  crExpLevels.push(last2[0] * 2);
  crExpLevels.push(last2[1] * 2);
}

Hooks.on("renderCombatTracker", async (app, html, data) => {
  if (!data.combat) {
    return;
  }

  const enemyDispositions = [CONST.TOKEN_DISPOSITIONS.HOSTILE];
  if (game.settings.get(CFG.id, "secretAsHostile")) {
    enemyDispositions.push(CONST.TOKEN_DISPOSITIONS.SECRET);
  }

  let xpTotal = 0;
  const pcLevels = [];
  for (const combatant of data.combat.combatants) {
    if (actorTypesWithCR.includes(combatant.actor.type) && enemyDispositions.includes(combatant.token.disposition)) {
      xpTotal += combatant.actor.getCRExp(combatant.actor.system.details.cr.total);
    } else if (combatant.actor.type === "character" && allyDispositions.includes(combatant.token.disposition)) {
      pcLevels.push(combatant.actor.system.attributes.hd.total);
    }
  }

  const temp = crExpLevels.filter((xp) => xp <= xpTotal);
  const approxCr = temp.length ? temp.length - 1 : 0;

  let apl = 0;
  if (pcLevels.length) {
    apl = Math.round(pcLevels.reduce((a, b) => a + b, 0) / pcLevels.length);
    if (pcLevels.length > 5) {
      apl++;
    }
    if (pcLevels.length < 4) {
      apl--;
    }
  }

  const difficultyIdx = Math.clamped(approxCr - apl + 2, 0, 5);
  const difficulty = difficulties[difficultyIdx];

  const header = html.find(".combat-tracker-header");
  if (game.user.isGM) {
    header.append(`
    <div class="flexrow">
      <span>${game.i18n.localize("CombatTrackerCr.CR")}: ${approxCr}</span>
      <span>${game.i18n.localize("CombatTrackerCr.APL")}: ${apl}</span>
      <span style="border-radius: 4px;${difficulty.style}">${game.i18n.localize(difficulty.label)}</span>
    </div>
  `);
  }
});

Hooks.once("init", () => {
  game.settings.register(CFG.id, "secretAsHostile", {
    name: game.i18n.localize("CombatTrackerCr.Settings.SecretAsHostile"),
    hint: game.i18n.localize("CombatTrackerCr.Settings.SecretAsHostileHint"),
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
});
