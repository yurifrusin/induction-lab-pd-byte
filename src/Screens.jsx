import {
  ArrowIcon,
  CheckIcon,
  CopyIcon,
  EyeIcon,
  MessageIcon,
  PlayIcon,
  ResetIcon,
  RiseIcon,
  TargetIcon,
  UndoIcon,
} from './icons.jsx'
import { MiniTower, Tower } from './Tower.jsx'

const STAGES = [
  { id: 'play', label: 'PLAY' },
  { id: 'notice', label: 'NOTICE' },
  { id: 'prove', label: 'PROVE' },
  { id: 'debrief', label: 'DEBRIEF' },
]

export function AppHeader({
  activeStage,
  classroom,
  onLeaveClass,
  onOpenClassroom,
  onStageChange,
  onTeacherLensChange,
  teacherLens,
}) {
  const activeIndex = STAGES.findIndex(({ id }) => id === activeStage)

  return (
    <header className="app-header">
      <button className="brand" onClick={() => onStageChange('play')} type="button">
        <span className="brand-mark" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span>Induction Lab</span>
      </button>

      <nav className="stage-nav" aria-label="Five-minute experience">
        {STAGES.map(({ id, label }, index) => (
          <button
            aria-current={activeStage === id ? 'step' : undefined}
            className={`${activeStage === id ? 'is-active' : ''} ${index < activeIndex ? 'is-complete' : ''}`}
            key={id}
            onClick={() => onStageChange(id)}
            type="button"
          >
            <span className="nav-label">{label}</span>
            <span className="nav-node" aria-hidden="true" />
          </button>
        ))}
      </nav>

      {classroom ? (
        <div className="class-status">
          <span className={`sync-dot sync-${classroom.syncState}`} aria-hidden="true" />
          <div><small>{classroom.code}</small><strong>{classroom.displayName}</strong></div>
          <button onClick={onLeaveClass} type="button">Leave</button>
        </div>
      ) : (
        <div className="header-actions">
          {onOpenClassroom && <button className="classroom-link" onClick={onOpenClassroom} type="button">Classroom</button>}
          <label className="lens-toggle">
            <span>Teacher lens</span>
            <input
              checked={teacherLens}
              onChange={(event) => onTeacherLensChange(event.target.checked)}
              type="checkbox"
            />
            <span className="toggle-track" aria-hidden="true"><span /></span>
          </label>
        </div>
      )}
    </header>
  )
}

function LensNote({ time, children }) {
  return (
    <aside className="lens-note" aria-label="Facilitator cue">
      <span className="lens-time">FACILITATOR · {time}</span>
      <p>{children}</p>
    </aside>
  )
}

function RailButton({ children, icon, onClick, disabled = false, primary = false }) {
  return (
    <button
      className={`rail-button ${primary ? 'is-primary' : ''}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{children}</span>
    </button>
  )
}

export function PlayScreen({
  completed,
  count,
  hintMove,
  message,
  moveCount,
  onCountChange,
  onMove,
  onNext,
  onReset,
  onShowHint,
  onUndo,
  pegs,
  selectedPeg,
  setSelectedPeg,
  target,
  teacherLens,
}) {
  return (
    <section className="screen play-screen">
      <aside className="control-rail">
        <div>
          <h1>Move the tower.<br />Then prove your best.</h1>
          <p className="lead">Move one disc at a time. Never place a larger disc on a smaller one.</p>
        </div>

        <div className="disc-control">
          <span className="control-label">DISCS</span>
          <div className="segmented-control" aria-label="Number of discs">
            {[2, 3, 4, 5].map((value) => (
              <button
                aria-pressed={count === value}
                className={count === value ? 'is-active' : ''}
                key={value}
                onClick={() => onCountChange(value)}
                type="button"
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="move-stats" aria-label="Move count and target">
          <div><span>MOVES</span><strong>{moveCount}</strong></div>
          <div><span>TARGET</span><strong>{target}</strong></div>
        </div>

        <div className="rail-question">
          <span className="question-mark" aria-hidden="true">?</span>
          <p>What must happen before the largest disc can move?</p>
        </div>

        <div className="rail-actions">
          <RailButton disabled={moveCount === 0} icon={<UndoIcon />} onClick={onUndo}>Undo</RailButton>
          <RailButton icon={<ResetIcon />} onClick={onReset}>Reset</RailButton>
          <RailButton icon={<EyeIcon />} onClick={onShowHint} primary>Show one move</RailButton>
        </div>

        {teacherLens && (
          <LensNote time="0:00–2:00">
            Invite moves and predictions. Let the problem create a need for the method; do not name induction yet.
          </LensNote>
        )}
      </aside>

      <div className="play-canvas">
        <Tower
          count={count}
          hintMove={hintMove}
          onMove={onMove}
          pegs={pegs}
          selectedPeg={selectedPeg}
          setSelectedPeg={setSelectedPeg}
        />

        <div className="play-equation" aria-label="Unknown moves plus one plus unknown moves">
          <span>?</span><b>+</b><span>1</span><b>+</b><span>?</span>
        </div>

        <div className={`game-message ${completed ? 'is-complete' : ''}`}>
          <p>{message}</p>
          {completed && (
            <button onClick={onNext} type="button">
              What did that prove? <ArrowIcon size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export function NoticeScreen({
  answer,
  moveCount,
  onAnswer,
  onBack,
  onNext,
  teacherLens,
}) {
  const correct = answer === 'possible'

  return (
    <section className="screen notice-screen">
      <aside className="control-rail notice-rail">
        <div>
          <h1>A solution is not a minimum.</h1>
          <p className="lead">A successful route gives an upper bound. A minimum needs something more.</p>
        </div>

        <div className="notice-summary">
          <div><strong>{moveCount}</strong><span>moves found</span></div>
          <span className="not-equals" aria-hidden="true">≠</span>
          <div><strong>?</strong><span>minimum proved</span></div>
        </div>

        {teacherLens && (
          <LensNote time="2:00–3:00">
            A checked example is evidence, not a universal claim. Ask participants to name exactly what the run establishes.
          </LensNote>
        )}

        <div className="bottom-rail-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>Back to play</RailButton>
        </div>
      </aside>

      <div className="notice-canvas">
        <div className="notice-tower">
          <MiniTower count={3} stage="rebuild" />
          <span className="found-stamp"><CheckIcon /> ROUTE FOUND</span>
        </div>

        <div className="notice-question-block">
          <h2>Finding {moveCount} moves proves…</h2>
          <div className="answer-list" role="group" aria-label="What has been proved">
            <button
              aria-pressed={answer === 'possible'}
              className={answer === 'possible' ? 'is-selected is-correct' : ''}
              onClick={() => onAnswer('possible')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>It can be done in {moveCount}.</strong><small>This establishes what is possible.</small></span>
            </button>
            <button
              aria-pressed={answer === 'minimum'}
              className={answer === 'minimum' ? 'is-selected is-wrong' : ''}
              onClick={() => onAnswer('minimum')}
              type="button"
            >
              <span className="radio-dot" />
              <span><strong>It cannot be done faster.</strong><small>This would require a lower bound.</small></span>
            </button>
          </div>

          {answer === 'minimum' && (
            <p className="answer-feedback is-wrong">Not yet. One route cannot rule out every shorter route.</p>
          )}

          {correct && (
            <div className="answer-feedback is-correct">
              <p><strong>Exactly.</strong> Now look for a cost that every legal solution must pay.</p>
              <button onClick={onNext} type="button">Find the unavoidable move <ArrowIcon /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProofStage({ label, math, number, stage }) {
  return (
    <div className="proof-stage">
      <div className="stage-title"><span>{number}</span><p>{label}</p></div>
      <MiniTower count={4} stage={stage} />
      <strong className="stage-math">{math}</strong>
    </div>
  )
}

export function ProveScreen({ answer, onAnswer, onBack, onNext, teacherLens }) {
  const correct = answer === 'all'

  return (
    <section className="screen prove-screen">
      <aside className="proof-rail">
        <div>
          <h1>One strategy is evidence. Is it proof?</h1>
          <p className="lead">Finding 7 moves shows the tower can move in 7. It does not show that 7 is the minimum.</p>
        </div>

        <div className="can-must-rail">
          <div className="logic-item logic-can">
            <span className="logic-icon"><CheckIcon /></span>
            <div><strong>CAN</strong><p>Exhibit a legal strategy. This shows what is possible.</p></div>
          </div>
          <span className="versus">vs.</span>
          <div className={`logic-item logic-must ${correct ? 'is-complete' : ''}`}>
            <span className="logic-icon">{correct && <CheckIcon />}</span>
            <div><strong>MUST</strong><p>Show every legal solution must pay a cost. This creates a lower bound.</p></div>
          </div>
        </div>

        <fieldset className="sentence-choice">
          <legend>Before the largest disc moves, <span>______</span> smaller discs must be together on the other peg.</legend>
          {['some', 'all'].map((choice) => (
            <label className={`${answer === choice ? 'is-selected' : ''} ${answer === 'some' && choice === 'some' ? 'is-wrong' : ''}`} key={choice}>
              <input
                checked={answer === choice}
                name="necessary-discs"
                onChange={() => onAnswer(choice)}
                type="radio"
              />
              <span className="radio-dot" />
              {choice}
            </label>
          ))}
        </fieldset>

        {answer === 'some' && <p className="compact-feedback">Some is not enough—the largest disc stays trapped.</p>}
        {correct && (
          <div className="lower-bound-result">
            <p>Therefore any legal solution needs at least:</p>
            <strong>M(n + 1) ≥ 2M(n) + 1</strong>
          </div>
        )}

        {teacherLens && (
          <LensNote time="3:00–4:30">
            Insist on “every legal solution”. That phrase turns an observed strategy into a strategy-independent lower bound.
          </LensNote>
        )}

        <div className="proof-rail-actions">
          <RailButton icon={<ArrowIcon direction="left" />} onClick={onBack}>Back</RailButton>
          <RailButton disabled={!correct} icon={<ArrowIcon />} onClick={onNext} primary>Reveal the equality</RailButton>
        </div>
      </aside>

      <div className="proof-canvas">
        <h2>What does every legal solution have to do?</h2>
        <div className="proof-stages">
          <ProofStage label="move n smaller" math="M(n)" number="1" stage="clear" />
          <ArrowIcon className="stage-arrow" size={36} />
          <ProofStage label="move largest" math="1" number="2" stage="largest" />
          <ArrowIcon className="stage-arrow" size={36} />
          <ProofStage label="move n smaller" math="M(n)" number="3" stage="rebuild" />
        </div>
        <div className="proof-sum" aria-label="M of n plus one plus M of n">
          <span>M(n)</span><b>+</b><span>1</span><b>+</b><span>M(n)</span>
        </div>
      </div>
    </section>
  )
}

function Takeaway({ children, icon, title, tone }) {
  return (
    <div className="takeaway">
      <span className={`takeaway-icon tone-${tone}`}>{icon}</span>
      <div><h3>{title}</h3><p>{children}</p></div>
    </div>
  )
}

export function DebriefScreen({ copied, onCopy, onRestart }) {
  return (
    <section className="screen debrief-screen">
      <aside className="teacher-takeaways">
        <span className="takeaway-label">TEACHER TAKEAWAYS</span>
        <Takeaway icon={<TargetIcon />} title="Problem before method" tone="amber">
          Let the puzzle create a need for the proof.
        </Takeaway>
        <Takeaway icon={<RiseIcon />} title={<>Strengthen <i>P(n)</i></>} tone="green">
          Prove achievability and minimality together.
        </Takeaway>
        <Takeaway icon={<MessageIcon />} title="LLM design move" tone="blue">
          Ask for manipulable state, live feedback and a reveal that follows the mathematics.
        </Takeaway>
      </aside>

      <div className="debrief-main">
        <div className="debrief-heading">
          <h1>The proof was hiding in the play.</h1>
          <p>The largest disc forces every legal solution into three stages.</p>
        </div>

        <div className="debrief-stages" aria-label="Three-stage recursive decomposition">
          <ProofStage label="move n smaller" math="M(n)" number="1" stage="clear" />
          <ArrowIcon className="stage-arrow" size={30} />
          <ProofStage label="move largest" math="1" number="2" stage="largest" />
          <ArrowIcon className="stage-arrow" size={30} />
          <ProofStage label="move n smaller" math="M(n)" number="3" stage="rebuild" />
        </div>

        <div className="logic-resolution">
          <div className="logic-box can-box"><span>CAN</span><strong>M(n + 1) ≤ 2M(n) + 1</strong></div>
          <div className="logic-box must-box"><span>MUST</span><strong>M(n + 1) ≥ 2M(n) + 1</strong></div>
          <div className="therefore">
            <span>Therefore</span><strong>M(n + 1) = 2M(n) + 1</strong>
            <p>A found strategy proves <em>CAN</em>. Unavoidable stages prove <b>MUST</b>.</p>
          </div>
        </div>

        <div className="run-line" aria-label="Five-minute facilitation timing">
          {[
            ['0:00', 'PLAY'],
            ['2:00', 'NOTICE'],
            ['3:00', 'PROVE'],
            ['4:30', 'DEBRIEF'],
          ].map(([time, label], index) => (
            <div className={index === 3 ? 'is-active' : ''} key={label}>
              <span>{time}</span><strong>{label}</strong><i aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="debrief-footer">
          <p>Teacher verifies the mathematics <span>•</span> No student data <span>•</span> Accessible alternatives</p>
          <div>
            <button onClick={onRestart} type="button"><ResetIcon /> Restart</button>
            <button className="copy-button" onClick={onCopy} type="button"><CopyIcon /> {copied ? 'Copied' : 'Copy the build brief'}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
