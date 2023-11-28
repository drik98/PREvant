<template>
  <!-- This component mocks the `ServiceInfo` component to simulate a loading state -->
  <div
    class="flex flex-row align-items-stretch p-3 gap-4"
  >
    <div class="flex flex-column align-items-center justify-content-center gap-2">
      <PrimeSkeleton
        class="mr-2"
        shape="circle"
        size="2rem"
      />
      <PrimeSkeleton
        class="mr-2"
        shape="circle"
        size="2rem"
      />
    </div>

    <div class="flex flex-column flex-grow-1 gap-2">
      <PrimeSkeleton
        border-radius="16px"
        class="mb-2"
        width="10rem"
      />

      <span class="flex flex-row gap-2 align-items-center">
        <PrimeSkeleton
          border-radius="16px"
          class="mb-2"
          width="6rem"
        />
        <PrimeSkeleton
          border-radius="16px"
          class="mb-2"
          width="3rem"
        />
      </span>

      <PrimeSkeleton
        border-radius="16px"
        class="mb-2"
        width="8rem"
      />
    </div>

    <div class="flex flex-column justify-content-between align-items-end">
      <PrimeSkeleton
        border-radius="8px"
        height="2rem"
        width="10rem"
      />
      <PrimeSkeleton
        border-radius="16px"
        class="mb-2"
        width="6rem"
      />
    </div>
  </div>
</template>
