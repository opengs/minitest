<template>
  <q-page class="row items-center justify-evenly q-gutter-md">
    <q-card style="width: 80%;">
      <q-card-actions>
        <q-btn flat color="negative" @click="quit">Powrót</q-btn>
        <a :href="fileURL" download="config.json">
          <q-btn label="Pobież konfiguracje" flat color="primary" />
        </a>
        <q-file label="Załaduj konfiguracje" @input="selectConfig" />
      </q-card-actions>
    </q-card>

    <q-card style="width: 80%; max-width:900px;" v-for="question in questions" :key="question.id">
      <img v-if="question.image !== null" :src="question.image">
      <q-card-actions>
        <q-file label="Dodaj obrazek" @input="(file) => selectImage(question.id, file)"/>
      </q-card-actions>
      <q-card-section>
        <div class="text-h6 text-center">{{ "Pytanie z " + (question.type == "SINGLE" ? "jedną odpowiedzią" : "wieloktrotnym wyborem") }}</div>
        <q-input filled type="text" label="Tekst pytania" v-model="question.questionString"/>
      </q-card-section>

      <q-card-section v-for="answer in question.answers" :key="answer.id">
        <q-input filled type="text" label="Odpowiedź" v-model="answer.text"/>
        <q-input filled type="number" label="Cena" v-model="answer.price"/>
        <q-btn flat label="Usuń" color="negative" class="fit" @click="removeAnswer(question.id, answer.id)"/>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn flat class="fit" @click="addAnswer(question.id)">Dodaj odpowiedź</q-btn>
        <q-btn class="fit" color="negative" @click="removeQuestion(question.id)">Usuń pytanie</q-btn>
      </q-card-actions>
    </q-card>

    <q-card style="width: 80%;">
      <q-card-section>
        <div class="text-h6 text-center">Dodaj kolejne pytanie</div>
      </q-card-section>
      <q-card-actions>
        <q-btn flat class="fit" @click="addQuestion('SINGLE')">Jedna odpowiedź</q-btn>
        <q-btn flat class="fit" @click="addQuestion('MULTIPLE')">Wiele odpowiedzi</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'

import { QuestionType, Answer, Question } from './models'

@Component({})
export default class PageCreator extends Vue {
    questions = [] as Question[]
    loaded = false

    questionCounter = 0
    answerCounter = 0

    fileURL = ""

    updateFile() {
        console.log("update")
        const jsonData = JSON.stringify(this.questions)
        const configBlob = new Blob([jsonData], {type: 'application/json'})
        this.fileURL = URL.createObjectURL(configBlob)
    }

    addQuestion(type: QuestionType) {
        const newQuestion = {
            id: this.questionCounter,
            image: "",
            questionString: "",
            type,
            answers: []
        } as Question

        this.questions.push(newQuestion)
        this.questionCounter += 1
        this.updateFile()
    }

    removeQuestion(id: number) {
        this.questions.splice(this.questions.findIndex((v) => v.id == id), 1);
        this.updateFile()
    }

    addAnswer(questionId: number) {
        const newAnswer = {
            id: this.answerCounter,
            text: "",
            price: 0
        } as Answer

        this.questions.find((v) => v.id == questionId)?.answers.push(newAnswer)
        this.answerCounter += 1
        this.updateFile()
    }

    removeAnswer(questionId: number, answerId: number) {
        const question = this.questions.find((v) => v.id == questionId)
        if (question !== undefined) {
            question.answers.splice(question.answers.findIndex((v) => v.id == answerId), 1)
        }
        this.updateFile()
    }

    async selectImage(id: number, image: File) {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        const base64Image = await toBase64(image);

        this.questions.find((v) => v.id == id)?.image = base64Image
        this.updateFile()
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

    mounted() {
        this.updateFile()
    }
}
</script>

<style scoped>
.question {
  width: 100%;
  max-width: 300px;
}
</style>