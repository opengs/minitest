enum QuestionType{
    SINGLE = "SINGLE",
    MULTIPLE = "MULTIPLE",
    OPEN = "OPEN"
}

interface Answer{
    id: number
    text: string
    price: number
}

interface Question{
    id: number
    image: string | null
    questionString: string
    type: QuestionType
    answers: Answer[]
}