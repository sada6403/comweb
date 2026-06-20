/* Uppercase display heading in the CSPLUS style: a bold word/phrase followed by
   a thin one, e.g. <Heading bold="Contact us" thin="today!" />. */
export default function Heading({ bold, thin, as = "h2", xl = false, className = "" }) {
  const Tag = as;
  return (
    <Tag className={`display ${xl ? "display--xl" : ""} ${className}`}>
      <strong>{bold}</strong>
      {thin ? <> {thin}</> : null}
    </Tag>
  );
}
