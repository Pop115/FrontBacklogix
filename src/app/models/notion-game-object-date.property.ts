export class NotionGameObjectDateProperty {
    date?: {
        start?: string, //YYYY-MM-DD
        end?: string,
        time_zone?: string
    }

    public setContent(content: string) {
        if (this.date)
            this.date.start = content;
    }

    public getContent() {
        return this.date?.start;
    }
}