interface ISelect<T = React.Key> {
  value: React.Key;
  label: string;
  data?: T;
}

export default ISelect;
