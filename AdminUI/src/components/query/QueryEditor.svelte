<script lang="ts">
  import type { QueryAction } from '@lib/types'
  import { Button, Alert } from '@components/common'
  import { validation, parseJSON, formatJSON } from '@lib/utils'

  interface Props {
    collections: string[]
    onExecute: (query: any) => Promise<void>
    isLoading?: boolean
  }

  let {
    collections,
    onExecute,
    isLoading = false
  }: Props = $props()

  let selectedCollection = $state('')
  let action = $state<QueryAction>('find')
  let queryJson = $state('{\n  "where": {},\n  "limit": 20\n}')
  let dataJson = $state('{}')
  let error = $state<string | null>(null)

  const actions: QueryAction[] = ['find', 'findOne', 'create', 'update', 'delete', 'count']

  const isQueryValid = $derived(validation.isValidJSON(queryJson))
  const isDataValid = $derived(validation.isValidJSON(dataJson))
  const canExecute = $derived(
    selectedCollection && isQueryValid && (action === 'create' || action === 'update' ? isDataValid : true)
  )

  const needsData = $derived(action === 'create' || action === 'update')

  function formatQuery() {
    if (isQueryValid) {
      const parsed = parseJSON(queryJson)
      queryJson = formatJSON(parsed)
      error = null
    }
  }

  function formatData() {
    if (isDataValid) {
      const parsed = parseJSON(dataJson)
      dataJson = formatJSON(parsed)
      error = null
    }
  }

  function loadExample() {
    const examples: Record<QueryAction, any> = {
      find: {
        where: { active: true },
        orderBy: { created_at: 'desc' },
        limit: 20
      },
      findOne: {
        where: { _id: 'document_id' }
      },
      create: {
        // data will be in separate field
      },
      update: {
        where: { _id: 'document_id' }
        // data will be in separate field
      },
      delete: {
        where: { _id: 'document_id' }
      },
      count: {
        where: { active: true }
      }
    }

    queryJson = formatJSON(examples[action])

    if (needsData) {
      dataJson = formatJSON({
        field: 'value',
        active: true
      })
    }
  }

  async function handleExecute() {
    error = null

    if (!selectedCollection) {
      error = 'Please select a collection'
      return
    }

    if (!isQueryValid) {
      error = 'Invalid query JSON'
      return
    }

    if (needsData && !isDataValid) {
      error = 'Invalid data JSON'
      return
    }

    try {
      const query = parseJSON(queryJson)
      const data = needsData ? parseJSON(dataJson) : undefined

      await onExecute({
        action,
        collection: selectedCollection,
        query,
        data
      })
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to execute query'
    }
  }
</script>

<div class="space-y-4">
  {#if error}
    <Alert type="error" dismissible ondismiss={() => (error = null)}>
      {error}
    </Alert>
  {/if}

  <!-- Collection and Action Selection -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div>
      <label class="block text-sm font-medium text-secondary-700 mb-1">
        Collection
      </label>
      <select
        bind:value={selectedCollection}
        class="block w-full rounded-lg border border-secondary-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        disabled={isLoading}
      >
        <option value="">Select a collection</option>
        {#each collections as collection}
          <option value={collection}>{collection}</option>
        {/each}
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-secondary-700 mb-1">
        Action
      </label>
      <select
        bind:value={action}
        class="block w-full rounded-lg border border-secondary-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        disabled={isLoading}
      >
        {#each actions as actionOption}
          <option value={actionOption}>{actionOption}</option>
        {/each}
      </select>
    </div>
  </div>

  <!-- Query Editor -->
  <div>
    <div class="flex items-center justify-between mb-1">
      <label class="block text-sm font-medium text-secondary-700">
        Query (MongoDB Syntax)
      </label>
      <div class="flex items-center space-x-2">
        {#if isQueryValid}
          <span class="text-xs text-green-600 flex items-center">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Valid
          </span>
          <button
            type="button"
            class="text-xs text-primary-600 hover:text-primary-800"
            onclick={formatQuery}
          >
            Format
          </button>
        {:else}
          <span class="text-xs text-red-600 flex items-center">
            <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Invalid
          </span>
        {/if}
        <button
          type="button"
          class="text-xs text-primary-600 hover:text-primary-800"
          onclick={loadExample}
        >
          Load Example
        </button>
      </div>
    </div>

    <textarea
      bind:value={queryJson}
      class="block w-full rounded-lg border {error && !isQueryValid
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
        : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'} px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors resize-y"
      rows={12}
      placeholder='{\n  "where": { "field": "value" },\n  "limit": 20\n}'
      disabled={isLoading}
      spellcheck={false}
    ></textarea>

    <p class="mt-1 text-xs text-secondary-500">
      Use MongoDB-style query syntax. Operators: $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $and, $or, $exists
    </p>
  </div>

  <!-- Data Editor (for create/update) -->
  {#if needsData}
    <div>
      <div class="flex items-center justify-between mb-1">
        <label class="block text-sm font-medium text-secondary-700">
          Data
        </label>
        <div class="flex items-center space-x-2">
          {#if isDataValid}
            <span class="text-xs text-green-600 flex items-center">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Valid
            </span>
            <button
              type="button"
              class="text-xs text-primary-600 hover:text-primary-800"
              onclick={formatData}
            >
              Format
            </button>
          {:else}
            <span class="text-xs text-red-600 flex items-center">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Invalid
            </span>
          {/if}
        </div>
      </div>

      <textarea
        bind:value={dataJson}
        class="block w-full rounded-lg border {error && !isDataValid
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'} px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors resize-y"
        rows={8}
        placeholder='{\n  "field": "value"\n}'
        disabled={isLoading}
        spellcheck={false}
      ></textarea>
    </div>
  {/if}

  <!-- Execute Button -->
  <div class="flex justify-end">
    <Button
      variant="primary"
      size="lg"
      onclick={handleExecute}
      loading={isLoading}
      disabled={isLoading || !canExecute}
    >
      <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Execute Query
    </Button>
  </div>
</div>
