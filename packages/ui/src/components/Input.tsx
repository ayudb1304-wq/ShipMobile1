import { TextInput, TextInputProps, View } from 'react-native';
import { Text } from './Text';
import { cn } from '../utils/cn';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text shown below input */
  helperText?: string;
  /** Additional container classes */
  containerClassName?: string;
  /** Additional input classes */
  className?: string;
}

export function Input({
  label,
  error,
  helperText,
  containerClassName,
  className,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <View className={cn('w-full', containerClassName)}>
      {label && (
        <Text
          variant="label"
          className="mb-1.5 text-base-content/80"
        >
          {label}
        </Text>
      )}
      <TextInput
        className={cn(
          'w-full px-4 py-3 rounded-btn',
          'bg-base-200 text-base-content',
          'border-2',
          hasError ? 'border-error' : 'border-transparent focus:border-primary',
          className
        )}
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        {...props}
      />
      {(error || helperText) && (
        <Text
          variant="caption"
          color={error ? 'error' : 'muted'}
          className="mt-1"
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}
