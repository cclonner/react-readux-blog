export default function trimText(str) {
  const text = str.slice(0, 40);
  return `${text}...`;
}
