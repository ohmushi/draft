'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteEntryButton({ slug }: { slug: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [pending, setPending] = useState(false)
  const router = useRouter()

  function openDialog() {
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    dialogRef.current?.close()
  }

  async function handleDelete() {
    setPending(true)
    try {
      const response = await fetch(`/api/entry/${slug}`, { method: 'DELETE' })
      if (response.ok) {
        router.push('/')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button className="delete-entry-btn" onClick={openDialog} type="button">
        supprimer
      </button>

      <dialog ref={dialogRef} className="delete-dialog">
        <p className="delete-dialog-message">Supprimer cette entrée ?</p>
        <div className="delete-dialog-actions">
          <button className="delete-dialog-cancel" onClick={closeDialog} type="button">
            annuler
          </button>
          <button
            className="delete-dialog-confirm"
            onClick={handleDelete}
            disabled={pending}
            type="button"
          >
            {pending ? '…' : 'supprimer'}
          </button>
        </div>
      </dialog>
    </>
  )
}
