'use client'

import { useEffect } from 'react'

const RightClickBlocker = () => {
  useEffect(() => {
    const getElementTarget = (target) => {
      if (target instanceof HTMLElement) return target
      if (target instanceof Node) return target.parentElement
      return null
    }

    const isEditableTarget = (target) => {
      const element = getElementTarget(target)
      if (!element) return false

      if (element.isContentEditable) return true

      return (
        element.closest('input, textarea, select, option, [contenteditable]:not([contenteditable="false"])') !== null
      )
    }

    // Block right-click (context menu)
    const handleContextMenu = (e) => {
      if (isEditableTarget(e.target)) return true
      e.preventDefault()
      return false
    }

    // Block common developer tools keyboard shortcuts
    const handleKeyDown = (e) => {
      if (!e.key) return
      const key = e.key.toLowerCase()
      const code = (e.code || '').toLowerCase()
      const matchesLetter = (letter) => key === letter || code === `key${letter}`
      const metaKeyPressed = e.ctrlKey || e.metaKey
      const editableTarget = isEditableTarget(e.target)

      // Block F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }

      // Block Ctrl/Cmd+Shift+I and Safari's Cmd+Option+I (Developer Tools)
      if (metaKeyPressed && (e.shiftKey || e.altKey) && matchesLetter('i')) {
        e.preventDefault()
        return false
      }

      // Block Ctrl+Shift+J (Console)
      if (metaKeyPressed && e.shiftKey && matchesLetter('j')) {
        e.preventDefault()
        return false
      }

      if (metaKeyPressed && matchesLetter('u')) {
        e.preventDefault()
        return false
      }

      // Block Ctrl+S (Save Page)
      if (metaKeyPressed && matchesLetter('s')) {
        e.preventDefault()
        return false
      }

      // Block Ctrl/Cmd+Shift+C and Safari's Cmd+Option+C (Inspect Element / Console)
      if (metaKeyPressed && (e.shiftKey || e.altKey) && matchesLetter('c')) {
        e.preventDefault()
        return false
      }

      // Block Ctrl+P (Print - can be used to view source)
      if (metaKeyPressed && matchesLetter('p')) {
        e.preventDefault()
        return false
      }

      // Block common copy/cut/select-all shortcuts for non-editable page content
      if (!editableTarget && metaKeyPressed && ['a', 'c', 'x'].some(matchesLetter)) {
        e.preventDefault()
        return false
      }
    }

    const handleSelectStart = (e) => {
      if (isEditableTarget(e.target)) return true
      e.preventDefault()
      return false
    }

    const handleCopy = (e) => {
      if (isEditableTarget(e.target)) return true
      e.preventDefault()
      return false
    }

    const handleCut = (e) => {
      if (isEditableTarget(e.target)) return true
      e.preventDefault()
      return false
    }

    const handleDragStart = (e) => {
      if (isEditableTarget(e.target)) return true
      e.preventDefault()
      return false
    }

    const style = document.createElement('style')
    style.setAttribute('data-right-click-blocker', 'true')
    style.textContent = `
      body {
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
      }

      input,
      textarea,
      select,
      option,
      [contenteditable]:not([contenteditable="false"]),
      [contenteditable]:not([contenteditable="false"]) * {
        -webkit-user-select: text;
        user-select: text;
        -webkit-touch-callout: default;
      }
    `
    document.head.appendChild(style)

    document.addEventListener('copy', handleCopy)
    document.addEventListener('cut', handleCut)
    document.addEventListener('dragstart', handleDragStart)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectstart', handleSelectStart)

    // Cleanup on unmount
    return () => {
      style.remove()
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectstart', handleSelectStart)
    }
  }, [])

  // This component doesn't render anything, so it won't affect styling
  return null
}

export default RightClickBlocker

