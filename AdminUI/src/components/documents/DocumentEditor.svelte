<script lang="ts">
  import { Button, Alert } from '@components/common'
  import { validation, parseJSON, formatJSON } from '@lib/utils'

  interface Props {
    document?: any
    onSubmit: (data: any) => Promise<boolean>
    onCancel: () => void
    isLoading?: boolean
  }

  let {
    document,
    onSubmit,
    onCancel,
    isLoading = false
  }: Props = $props()

  let jsonContent = $state(
    document?.data ? formatJSON(document.data) : '{\n  \n}'
  )
  let error = $state<string | null>(null)

  const isEditMode = $derived(!!document)
  const isValid = $derived(validation.isValidJSON(jsonContent))

  function formatJson() {
    if (isValid) {
      const parsed = parseJSON(jsonContent)
      jsonContent = formatJSON(parsed)
      error = null
    }
  }

  function validateJson() {
    if (!validation.isValidJSON(jsonContent)) {
      error = 'Invalid JSON format'
      return false
    }
    error = null
    return true
  }

  async function handleSubmit(event: Event) {
    event.preventDefault()

    if (!validateJson()) {
      return
    }

    try {
      const data = parseJSON(jsonContent)
      const success = await onSubmit(data)

      if (success) {
        // Parent will handle navigation/modal close
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to save document'
    }
  }

  function handleInput() {
    if (error && validation.isValidJSON(jsonContent)) {
      error = null
    }
  }
</script>

<form class="space-y-4" onsubmit={handleSubmit}>
  {#if error}
    <Alert type="error" dismissible ondismiss={() => (error = null)}>
      {error}
    </Alert>
  {/if}

  <!-- JSON Editor -->
  <div>
    <div class="flex items-center justify-between mb-2">
      <label class="block text-sm font-medium text-secondary-700">
        Document Data (JSON)
      </label>
      <div class="flex items-center space-x-2">
        {#if isValid}
          <span class="text-xs text-green-600 flex items-center">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Valid JSON
          </span>
          <button
            type="button"
            class="text-xs text-primary-600 hover:text-primary-800"
            onclick={formatJson}
          >
            Format
          </button>
        {:else}
          <span class="text-xs text-red-600 flex items-center">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Invalid JSON
          </span>
        {/if}
      </div>
    </div>

    <textarea
      bind:value={jsonContent}
      class="block w-full rounded-lg border {error
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'} px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors resize-y"
      rows={20}
      placeholder={'{\n  "field": "value"\n}'}
      disabled={isLoading}
      oninput={handleInput}
      spellcheck={false}
    ></textarea>

    <p class="mt-1 text-xs text-secondary-500">
      Enter valid JSON data for the document. Fields starting with _ are reserved.
    </p>
  </div>

  <!-- Document Metadata (if editing) -->
  {#if isEditMode && document}
    <div class="bg-secondary-50 rounded-lg p-4 space-y-2">
      <h4 class="text-sm font-medium text-secondary-900">Document Info</h4>
      <div class="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span class="text-secondary-500">ID:</span>
          <code class="ml-2 text-secondary-900">{document.id}</code>
        </div>
        <div>
          <span class="text-secondary-500">Version:</span>
          <span class="ml-2 text-secondary-900">v{document.version}</span>
        </div>
        <div>
          <span class="text-secondary-500">Created:</span>
          <span class="ml-2 text-secondary-900">
            {new Date(document.created_at).toLocaleString()}
          </span>
        </div>
        <div>
          <span class="text-secondary-500">Updated:</span>
          <span class="ml-2 text-secondary-900">
            {new Date(document.updated_at).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Actions -->
  <div class="flex justify-end space-x-3 pt-4">
    <Button
      type="button"
      variant="ghost"
      onclick={onCancel}
      disabled={isLoading}
    >
      Cancel
    </Button>
    <Button
      type="submit"
      variant="primary"
      loading={isLoading}
      disabled={isLoading || !isValid}
    >
      {isEditMode ? 'Update Document' : 'Create Document'}
    </Button>
  </div>
</form>
