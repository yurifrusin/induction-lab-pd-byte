export const makePegs = (count) => [
  Array.from({ length: count }, (_, index) => count - index),
  [],
  [],
]

export const clonePegs = (pegs) => pegs.map((peg) => [...peg])

export function moveDisk(pegs, from, to) {
  if (from === to || pegs[from].length === 0) return null

  const next = clonePegs(pegs)
  const disk = next[from][next[from].length - 1]
  const targetTop = next[to][next[to].length - 1]

  if (targetTop !== undefined && targetTop < disk) return null

  next[from].pop()
  next[to].push(disk)
  return next
}

export function legalMoves(pegs) {
  const moves = []
  for (let from = 0; from < 3; from += 1) {
    for (let to = 0; to < 3; to += 1) {
      if (from !== to && moveDisk(pegs, from, to)) moves.push({ from, to })
    }
  }
  return moves
}

const encode = (pegs) => pegs.map((peg) => peg.join(',')).join('|')

export function findNextShortestMove(startPegs, count) {
  if (startPegs[2].length === count) return null

  const queue = [{ pegs: clonePegs(startPegs), first: null }]
  const visited = new Set([encode(startPegs)])

  while (queue.length) {
    const current = queue.shift()
    for (const move of legalMoves(current.pegs)) {
      const next = moveDisk(current.pegs, move.from, move.to)
      const key = encode(next)
      if (visited.has(key)) continue

      const first = current.first ?? move
      if (next[2].length === count) return first

      visited.add(key)
      queue.push({ pegs: next, first })
    }
  }

  return null
}

export const isComplete = (pegs, count) => pegs[2].length === count

export const optimalMoves = (count) => 2 ** count - 1
