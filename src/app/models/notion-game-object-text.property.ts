export class NotionGameObjectTextProperty {
    id?: string;
    rich_text?: [
        {
            "text": { "content": string }
        }
    ];
    type?: "rich_text";

    public setContent(content: string) {

        if (this.rich_text) {
            if (this.rich_text[0] != null) {
                this.rich_text[0].text.content = content;
            } else {
                this.rich_text = [{"text": {"content": content}}];
            }
        }
    }

    public getContent() {
        return this.rich_text && this.rich_text.length > 0 ? this.rich_text[0].text.content : null;
    }
}