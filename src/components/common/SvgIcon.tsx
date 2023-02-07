import dynamic from 'next/dynamic';

export type IconNames =
  | 'arrow-left'
  | 'arrow-right'
  | 'checkbox-empty'
  | 'checkbox-filled'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'heading'
  | 'quick-links';

export type IconProps = {
  icon: IconNames;
  className?: string;
};

const SvgIcon = ({ icon, className }: IconProps): JSX.Element => {
  const IconContent = dynamic(() => import(`./icons/icon--${icon}`));
  const viewBox = '0 0 90 90';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      display={'block'}
    >
      <IconContent />
    </svg>
  );
};

SvgIcon.defaultProps = {
  className: '',
};

export default SvgIcon;
