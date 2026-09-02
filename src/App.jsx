import { useState } from 'react'
import { findNextShortestMove, isComplete, makePegs, moveDisk, optimalMoves } from './game.js'
import { AppHeader, DebriefScreen, NoticeScreen, PlayScreen, ProveScreen } from './Screens.jsx'

const BUILD_BRIEF = `Design an accessible Tower of Hanoi simulator for Year 12 Specialist Mathematics.

Learning sequence:
1. Put the problem before the method: let students play before naming induction.
2. Enforce legal moves, track attempts and give optional next-move feedback.
3. After a solution, ask what has actually been proved: possibility is not minimality.
4. Focus attention on the largest disc. Reveal the unavoidable decomposition M(n) + 1 + M(n).
5. Distinguish CAN (a constructive upper bound) from MUST (a strategy-independent lower bound).
6. Keep the strengthened proposition visible: n discs can be moved in 2^n - 1 moves, and every legal transfer requires at least 2^n - 1 moves.

Safeguards:
- The teacher verifies every mathematical statement and tests edge cases.
- Collect no student names, prompts or personal data.
- Provide click, keyboard and touch alternatives, clear feedback and reduced-motion support.
- Use the LLM as a design collaborator, not an automated assessor.`

export default function App() {
  const [stage, setStage] = useState('play')
  const [teacherLens, setTeacherLens] = useState(false)
  const [discCount, setDiscCount] = useState(3)
  const [pegs, setPegs] = useState(() => makePegs(3))
  const [history, setHistory] = useState([])
  const [selectedPeg, setSelectedPeg] = useState(null)
  const [hintMove, setHintMove] = useState(null)
  const [message, setMessage] = useState('Select the top disc, then choose a destination peg.')
  const [noticeAnswer, setNoticeAnswer] = useState(null)
  const [proveAnswer, setProveAnswer] = useState(null)
  const [copied, setCopied] = useState(false)

  const moveCount = history.length
  const target = optimalMoves(discCount)
  const completed = isComplete(pegs, discCount)

  const resetGame = (nextCount = discCount) => {
    setDiscCount(nextCount)
    setPegs(makePegs(nextCount))
    setHistory([])
    setSelectedPeg(null)
    setHintMove(null)
    setNoticeAnswer(null)
    setProveAnswer(null)
    setMessage('Select the top disc, then choose a destination peg.')
  }

  const changeStage = (nextStage) => {
    setStage(nextStage)
    setSelectedPeg(null)
    setHintMove(null)
    if (nextStage === 'debrief') setTeacherLens(true)
  }

  const attemptMove = (from, to) => {
    const next = moveDisk(pegs, from, to)
    setHintMove(null)
    setSelectedPeg(null)

    if (!next) {
      setMessage('That move is not legal: a larger disc cannot sit on a smaller one.')
      return
    }

    const nextHistory = [...history, pegs.map((peg) => [...peg])]
    setHistory(nextHistory)
    setPegs(next)

    if (isComplete(next, discCount)) {
      const result = nextHistory.length === target ? 'optimal' : 'complete'
      setMessage(
        result === 'optimal'
          ? `Solved in ${nextHistory.length} moves — you matched the target.`
          : `Solved in ${nextHistory.length} moves. Now ask whether that proves a minimum.`,
      )
    } else {
      setMessage(`Legal move. ${nextHistory.length} move${nextHistory.length === 1 ? '' : 's'} so far.`)
    }
  }

  const undo = () => {
    if (!history.length) return
    const previous = history[history.length - 1]
    setPegs(previous)
    setHistory(history.slice(0, -1))
    setSelectedPeg(null)
    setHintMove(null)
    setMessage('Last move undone.')
  }

  const showHint = () => {
    const hint = findNextShortestMove(pegs, discCount)
    if (!hint) {
      setMessage('The tower is already complete.')
      return
    }
    setHintMove(hint)
    setMessage(`Try moving the top disc from peg ${'ABC'[hint.from]} to peg ${'ABC'[hint.to]}.`)
  }

  const copyBuildBrief = async () => {
    try {
      await navigator.clipboard.writeText(BUILD_BRIEF)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
      setMessage('Copy was blocked by the browser. The build brief is available in the facilitator notes.')
    }
  }

  const restartExperience = () => {
    resetGame(3)
    setTeacherLens(false)
    setStage('play')
  }

  return (
    <div className={`app stage-${stage}`}>
      <a className="skip-link" href="#main-content">Skip to activity</a>
      <AppHeader
        activeStage={stage}
        onStageChange={changeStage}
        onTeacherLensChange={setTeacherLens}
        teacherLens={teacherLens}
      />

      <main id="main-content">
        {stage === 'play' && (
          <PlayScreen
            completed={completed}
            count={discCount}
            hintMove={hintMove}
            message={message}
            moveCount={moveCount}
            onCountChange={(count) => resetGame(count)}
            onMove={attemptMove}
            onNext={() => changeStage('notice')}
            onReset={() => resetGame()}
            onShowHint={showHint}
            onUndo={undo}
            pegs={pegs}
            selectedPeg={selectedPeg}
            setSelectedPeg={setSelectedPeg}
            target={target}
            teacherLens={teacherLens}
          />
        )}

        {stage === 'notice' && (
          <NoticeScreen
            answer={noticeAnswer}
            moveCount={completed ? moveCount : target}
            onAnswer={setNoticeAnswer}
            onBack={() => changeStage('play')}
            onNext={() => changeStage('prove')}
            target={target}
            teacherLens={teacherLens}
          />
        )}

        {stage === 'prove' && (
          <ProveScreen
            answer={proveAnswer}
            onAnswer={setProveAnswer}
            onBack={() => changeStage('notice')}
            onNext={() => changeStage('debrief')}
            teacherLens={teacherLens}
          />
        )}

        {stage === 'debrief' && (
          <DebriefScreen
            copied={copied}
            onCopy={copyBuildBrief}
            onRestart={restartExperience}
          />
        )}
      </main>
      <p className="sr-only" aria-live="polite">{message}</p>
      {copied && <div className="toast" role="status">Build brief copied</div>}
    </div>
  )
}
