Hooks.on("renderCombatTracker", async (app, html, data) => {
  let xpTotal = 0;
  const pcLevels = [];
  for (const combatant of data.combat.combatants) {
    if (combatant.actor.type === "npc" && combatant.token.disposition === CONST.TOKEN_DISPOSITIONS.HOSTILE) {
      xpTotal += combatant.actor.getCRExp(combatant.actor.system.details.cr.total);
    } else if (
      combatant.actor.type === "character" &&
      combatant.token.disposition === CONST.TOKEN_DISPOSITIONS.FRIENDLY
    ) {
      pcLevels.push(combatant.actor.system.attributes.hd.total);
    }
  }

  const temp = pf1.config.CR_EXP_LEVELS.filter((xp) => xp <= xpTotal);
  const approxCr = temp.length ? temp.length - 1 : 0;

  let apl = Math.round(pcLevels.reduce((a, b) => a + b) / pcLevels.length);
  if (pcLevels.length > 5) {
    apl++;
  }
  if (pcLevels.length < 4) {
    apl--;
  }

  const header = html.find(".combat-tracker-header");
  header.append(`
    <div class="flexrow">
      <span>${game.i18n.localize("CombatTrackerCr.ApproxCR")}: ${approxCr}</span>
      <span>${game.i18n.localize("CombatTrackerCr.APL")}: ${apl}</span>
    </div>
  `);
});
