const Icon = ({ children, size = 20, className = '' }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
  >
    {children}
  </svg>
)

export const UndoIcon = (props) => (
  <Icon {...props}>
    <path d="M8.2 7.2 4.5 11l3.7 3.8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    <path d="M5 11h7.4a5.2 5.2 0 1 1 0 10.4H9.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </Icon>
)

export const ResetIcon = (props) => (
  <Icon {...props}>
    <path d="M20 7v5h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    <path d="M18.7 16a8 8 0 1 1 .8-7.1L20 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </Icon>
)

export const EyeIcon = (props) => (
  <Icon {...props}>
    <path d="M2.5 12s3.3-5.3 9.5-5.3 9.5 5.3 9.5 5.3-3.3 5.3-9.5 5.3S2.5 12 2.5 12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </Icon>
)

export const ArrowIcon = ({ direction = 'right', ...props }) => (
  <Icon {...props} className={`arrow-icon arrow-${direction}`}>
    <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
)

export const CopyIcon = (props) => (
  <Icon {...props}>
    <rect x="8" y="7" width="11" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M16 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
  </Icon>
)

export const PlayIcon = (props) => (
  <Icon {...props}>
    <path d="m9 7 7 5-7 5V7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
)

export const CheckIcon = (props) => (
  <Icon {...props}>
    <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
)

export const TargetIcon = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="13" r="7" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="11" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.7" />
    <path d="m14 10 6-6m0 0v4m0-4h-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
  </Icon>
)

export const RiseIcon = (props) => (
  <Icon {...props}>
    <path d="m4 17 5-5 3 3 7-8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    <path d="M15 7h4v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
  </Icon>
)

export const MessageIcon = (props) => (
  <Icon {...props}>
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    <path d="M7.5 8.5h9M7.5 12h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
  </Icon>
)
