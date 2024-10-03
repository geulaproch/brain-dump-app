export const Select = ({ children, ...props }) => <select {...props}>{children}</select>;
Select.Option = ({ children, ...props }) => <option {...props}>{children}</option>;