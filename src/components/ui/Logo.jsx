import { memo } from 'react'


function Logo({ size = 36, withText = true, light = true }) {
  return (
    <span className="logo" aria-label="Fintech Flow">
      <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#C8973A" />
        <path d="M32 11 14 20v13c0 11 7.6 18.2 18 21 10.4-2.8 18-10 18-21V20L32 11z" fill="#2A2A2A" />
        <path d="M21 38l8-8 5 5 9-11" fill="none" stroke="#C8973A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="43" cy="24" r="2.6" fill="#C8973A" />
      </svg>
      {withText && (
        <span className="logo-text" style={{ color: light ? '#C8973A' : '#2A2A2A' }}>
          Fintech <strong>Flow</strong>
        </span>
      )}
    </span>
  )
}

export default memo(Logo)