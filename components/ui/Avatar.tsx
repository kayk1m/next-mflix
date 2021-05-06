import React from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'unsized';
  circular?: boolean;
}

const Avatar: React.FC<Props> = ({
  className,
  src = 'https://cdn.ondp.app/static/defaultProfile.png',
  size = 'lg',
  circular = true,
}) => {
  const sizeInPixel = React.useMemo(() => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 48;
      case 'xl':
        return 56;
      case '2xl':
        return 64;
      default:
        return undefined;
    }
  }, [size]);

  return (
    <span
      className={cn(className, 'inline-block', {
        relative: size !== 'unsized',
        'overflow-hidden bg-gray-100': src === null,
        'rounded-full': circular,
        'rounded-md': !circular,
        'w-6 h-6': size === 'xs',
        'w-8 h-8': size === 'sm',
        'w-10 h-10': size === 'md',
        'w-12 h-12': size === 'lg',
        'w-14 h-14': size === 'xl',
        'w-16 h-16': size === '2xl',
      })}
    >
      {size === 'unsized' || sizeInPixel === undefined ? (
        <img
          className={cn(
            'absolute inset-0 object-cover w-full h-full',
            circular ? 'rounded-full' : 'rounded-md',
          )}
          src={src}
          loading="lazy"
          alt=""
        />
      ) : (
        <img
          className={cn(
            'w-full h-full object-cover',
            circular ? 'rounded-full' : 'rounded-md',
          )}
          src={src}
          width={sizeInPixel}
          height={sizeInPixel}
          loading="lazy"
          alt=""
        />
      )}
    </span>
  );
};

export default React.memo(Avatar);
