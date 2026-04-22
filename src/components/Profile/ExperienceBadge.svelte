<script lang="ts">
  let { text, customClass = '' }: { text: string; customClass?: string } = $props();
</script>

<span class="inline-block badge badge-inactive {customClass}">
  {text}
</span>
