import {
  teams,
  players,
  generateArticle,
  generateTeamsArticles
} from './dummy-data'

let cachedPlayers = null
let cachedTeams = {}
let cachedTeamNames = null

export function getPlayers (teamId) {
  return new Promise((res) => {
    if (cachedPlayers === null) {
      cachedPlayers = players
      return setTimeout(() => res(teamId ? teams[teamId].players : cachedPlayers), 800)
    }

    return res(teamId ? teams[teamId].players : cachedPlayers)
  })
}

export function getTeam (teamId) {
  return new Promise((res) => {
    if (typeof cachedTeams[teamId] === 'undefined') {
      cachedTeams[teamId] = teams[teamId]
      return setTimeout(() => res(cachedTeams[teamId]), 800)
    }

    return res(cachedTeams[teamId])
  })
}

export function getTeamNames () {
  return new Promise((res) => {
    if (cachedTeamNames === null) {
      cachedTeamNames = Object.keys(teams)
      return setTimeout(() => res(cachedTeamNames), 400)
    }

    return res(cachedTeamNames)
  })
}

export function getArticle (teamId, id) {
  return new Promise((res) => {
    setTimeout(() => res(generateArticle(teamId, id)), 700)
  })
}

export function getTeamsArticles (teamId) {
  return new Promise((res) => {
    setTimeout(() => res(generateTeamsArticles(teamId)), 700)
  })
}

export function processBrokenData(data) {
  const { paddyInTons, moisture, rejectedIn36Secs, smallBroken, bigBroken, chaki } = data;
  const ricePcBasedOnMoisterPc = 68.21-(moisture-14)*1.21;
  const rejectedIn24Hrs = rejectedIn36Secs/36*86.4;
  const pcRejected = rejectedIn24Hrs*100/paddyInTons;

  const riceInKg = 75*ricePcBasedOnMoisterPc/100;
  const rejectedInKg = 75*pcRejected/100;
  const bigBrokenInKg = riceInKg*bigBroken/100;
  const smallBrokenInKg = riceInKg*smallBroken/100
  const chakiInKg = riceInKg*chaki/100;
  const headRiceInKg = riceInKg - (rejectedInKg+bigBrokenInKg+smallBrokenInKg+chakiInKg);

  return {
    riceInKg: riceInKg.toFixed(3),
    rejectedInKg: rejectedInKg.toFixed(3),
    bigBrokenInKg: bigBrokenInKg.toFixed(3),
    smallBrokenInKg: smallBrokenInKg.toFixed(3),
    chakiInKg: chakiInKg.toFixed(3),
    headRiceInKg: headRiceInKg.toFixed(3)
  };
}
