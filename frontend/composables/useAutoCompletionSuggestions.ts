export default function (allAvailableSuggestions: Ref<string[]> | string[]) {
  const filter = ref('')

  function setFilter(newFilter: string) {
    filter.value = newFilter
  }

  const filteredSuggestions = computed(() => {
    return unref(allAvailableSuggestions)
      .filter(suggestion => suggestion.toLocaleLowerCase().includes(filter.value.toLocaleLowerCase()))
  })

  return { filteredSuggestions, setFilter }
}
