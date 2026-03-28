export const FailedIcon: React.FunctionComponent<React.ComponentProps<'svg'>> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="15" height="15" rx="7.5" fill="#E7000B" />
    <g clipPath="url(#clip0_168_11723)">
      <path
        d="M3.5 12.5L2.5 11.5L6.5 7.5L2.5 3.5L3.5 2.5L7.5 6.5L11.5 2.5L12.5 3.5L8.5 7.5L12.5 11.5L11.5 12.5L7.5 8.5L3.5 12.5Z"
        fill="#FAFAFA"
      />
    </g>
    <defs>
      <clipPath id="clip0_168_11723">
        <rect width="6" height="6" fill="white" transform="translate(4.5 4.5)" />
      </clipPath>
    </defs>
  </svg>
);

export const SuccessIcon: React.FunctionComponent<React.ComponentProps<'svg'>> = (props) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 7.5C15 11.6423 11.6423 15 7.5 15C3.35775 15 0 11.6423 0 7.5C0 3.35775 3.35775 0 7.5 0C11.6423 0 15 3.35775 15 7.5ZM10.5225 5.2275C10.6278 5.33297 10.687 5.47594 10.687 5.625C10.687 5.77406 10.6278 5.91703 10.5225 6.0225L6.7725 9.7725C6.66703 9.87784 6.52406 9.93701 6.375 9.93701C6.22594 9.93701 6.08297 9.87784 5.9775 9.7725L4.4775 8.2725C4.42223 8.221 4.37791 8.1589 4.34716 8.0899C4.31642 8.0209 4.29989 7.94642 4.29856 7.87089C4.29722 7.79536 4.31112 7.72034 4.33941 7.6503C4.3677 7.58026 4.40981 7.51664 4.46322 7.46322C4.51664 7.40981 4.58026 7.3677 4.6503 7.33941C4.72034 7.31112 4.79536 7.29722 4.87089 7.29856C4.94642 7.29989 5.0209 7.31642 5.0899 7.34716C5.1589 7.37791 5.221 7.42224 5.2725 7.4775L6.375 8.58L8.05125 6.90375L9.7275 5.2275C9.83297 5.12216 9.97594 5.06299 10.125 5.06299C10.2741 5.06299 10.417 5.12216 10.5225 5.2275Z"
      fill="currentColor"
    />
  </svg>
);
