/* © 2017-2023 Booz Allen Hamilton Inc. All Rights Reserved. */

import "./ErrorMessage.scss";

import * as React from "react";
import cx from "classnames";

interface ErrorMessageProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ErrorMessage({
  children,
  className,
  role,
  ...rest
}: ErrorMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <div {...rest}>
      {children ? (
        <div role={role} className={cx("error-message", className)}>
          <span className="asterisk">*</span> {children}
        </div>
      ) : null}
    </div>
  );
}
