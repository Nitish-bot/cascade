import { useEffect, useRef } from "react";
import { getErrorMessage } from "@/lib/errors";

type Props = Readonly<{
  error: unknown;
  onClose?(): false | void;
  title?: string;
}>;

export function ErrorDialog({ error, onClose, title }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => {
        if (!onClose || onClose() !== false) {
          dialogRef.current?.close();
        }
      }}
      style={{
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}
    >
      <h2 style={{ color: 'red', margin: '0 0 16px 0' }}>{title ?? "We encountered the following error"}</h2>
      <div>
        <blockquote style={{
          borderLeft: '4px solid #ccc',
          margin: '8px 0',
          padding: '8px 16px',
          fontStyle: 'italic'
        }}>{getErrorMessage(error, "Unknown")}</blockquote>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          onClick={() => dialogRef.current?.close()}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#f5f5f5',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}