'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = Readonly<{
  onClose: () => void
  onCreate: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    role: string
    phone: string
  }) => void
}>

export default function CreateUserModal({ onClose, onCreate }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('CITIZEN')
  const [phone, setPhone] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onCreate({ firstName, lastName, email, password, role, phone })
  }

  const fieldClass =
    'w-full rounded-md border border-input bg-bg-base/80 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-[0_24px_80px_rgba(28,25,23,0.22)]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-black text-t1">Creer un utilisateur</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-t3 hover:bg-muted hover:text-t1" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="space-y-3 p-5">
          <Field id="user-first-name" label="Prenom" value={firstName} onChange={setFirstName} className={fieldClass} />
          <Field id="user-last-name" label="Nom" value={lastName} onChange={setLastName} className={fieldClass} />
          <Field id="user-email" label="Email" type="email" value={email} onChange={setEmail} className={fieldClass} />
          <Field id="user-password" label="Mot de passe" type="password" value={password} onChange={setPassword} className={fieldClass} />
          <div>
            <label htmlFor="user-role" className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-t3">
              Role
            </label>
            <select id="user-role" className={fieldClass} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="CITIZEN">CITIZEN</option>
            </select>
          </div>
          <Field id="user-phone" label="Telephone" value={phone} onChange={setPhone} className={fieldClass} />

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Creer</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  className,
  type = 'text',
}: Readonly<{
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  className: string
  type?: string
}>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-bold uppercase tracking-[0.12em] text-t3">
        {label}
      </label>
      <input id={id} type={type} className={className} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
