'use client';
import { Separator } from '@ankora/ui-library';

interface Props {
  text: string;
}
const SeparatorWithText = ({ text }: Props) => {
  return (
    <div className='flex items-center'>
      <Separator />
      <p className='w-[50px] text-center text-gray-500 mx-4'>{text}</p>
      <Separator />
    </div>
  );
};

export default SeparatorWithText;
