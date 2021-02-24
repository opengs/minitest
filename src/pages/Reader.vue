<template>
  <q-page class="row items-center justify-evenly q-gutter-md">
    <q-card style="width: 80%;">
      <q-card-actions>
        <q-btn flat color="negative" @click="quit">Powrót</q-btn>
        <q-file label="Załaduj konfiguracje" @input="selectConfig" v-model="openedFile"/>
      </q-card-actions>
    </q-card>

    <q-card style="width: 80%; max-width:900px;" v-for="question in questions" :key="question.id">
      <img v-if="question.image !== null" :src="question.image">
      <q-card-section>
        <div class="text-h6 text-center">{{ "Pytanie z " + (question.type == "SINGLE" ? "jedną odpowiedzią" : "wieloktrotnym wyborem") }}</div>
        <div class="text-h5">{{ question.questionString }}</div>
      </q-card-section>

      <q-table
        :data="question.answers"
        :columns="answerColumns"
        row-key="id"
        :selection='(question.type == "SINGLE" ? "single" : "multiple")'
        :selected.sync="question.answer"
      >
      <template v-slot:bottom></template>
      <template v-slot:top></template>
      </q-table>
    </q-card>

    <q-card style="width: 80%;">
      <!-- <q-card-section>
        <div class="text-h6 text-center">Dodaj kolejne pytanie</div>
      </q-card-section> -->
      <q-card-actions>
        <q-btn flat class="fit" @click="endTest">Koniec testu</q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="endTestDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Koniec testu</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ "Twój wynnik końcowy, to " + endTestResult }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup @click="quit"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import { QuestionType, Answer, Question } from './models'

const answerColumns = [
  { name: 'text', field: 'text' }
]

@Component({})
export default class PageReader extends Vue {
    answerColumns = answerColumns
    
    questions = [] as Question[]

    openedFile = null as null | File

    endTestDialog = false
    endTestResult = 0

    get loaded(): boolean {
      return this.openedFile !== null
    }

    async selectConfig(file: File) {
        const readFile = () => new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(file)
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

        const text = await readFile();
        this.questions = JSON.parse(text)
    }

    async quit() {
        await this.$router.push({path: '/'})
    }

    endTest() {
      this.endTestResult = 0

      for(const question of this.questions) {
        if (question.answer != null && question.answer.length != 0) {
          for(const answer of question.answer) {
            console.log(Number(answer.price))
            this.endTestResult += Number(answer.price)
          }
        } else {
          this.endTestResult -= 1
        }
      }

      this.endTestDialog = true
    }
}
</script>

<style scoped>
.question {
  width: 100%;
  max-width: 300px;
}
</style>