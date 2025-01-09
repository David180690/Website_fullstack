<script>
    let num = 5;
</script>


{#if num > 5}
	<p>The number is greater than 5</p>
{:else if num < 5}
	<p>The number is less than 5</p>
{:else}
	<p>The number is 5</p>
{/if}