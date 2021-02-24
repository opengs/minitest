<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-center">Kim jesteś?</div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat @click="goReader">Uczeń</q-btn>
        <q-btn flat @click="goCreator">Prowadzący</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'


@Component({})
export default class PageIndex extends Vue {
  async goCreator() {
    await this.$router.push({name: 'creator'})
  }

  async goReader() {
    await this.$router.push({name: 'reader'})
  }
}
</script>
