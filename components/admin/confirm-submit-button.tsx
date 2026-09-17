"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof Button>;

interface ConfirmSubmitButtonProps extends ButtonProps {
  confirmMessage: string;
}

/** A submit button that asks for confirmation before the form submits — used for every delete action across the admin dashboard. */
export function ConfirmSubmitButton({
  confirmMessage,
  onClick,
  ...props
}: ConfirmSubmitButtonProps) {
  const handleClick: NonNullable<ButtonProps["onClick"]> = (event) => {
    if (!window.confirm(confirmMessage)) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return <Button {...props} onClick={handleClick} />;
}
