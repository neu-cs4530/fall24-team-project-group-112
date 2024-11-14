import React from 'react';

/**
 * Interface representing the props for the Avatar component.
 *
 * - avatarName The name of the user's avatar image.
 */
interface AvatarProps {
  avatarName: string;
  width?: number;
  height?: number;
}

/**
 * Avatar component that displays the user's avatar image.
 *
 * @param avatarName The name of the user's avatar image.
 */
const Avatar = ({ avatarName, width = 150, height = 150 }: AvatarProps) => (
  <img src={`/images/${avatarName}.svg`} alt='avatar' width={width} height={height} />
);

export default Avatar;
