import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
   // public async parse({ template, variables }: IParseMailTemplateDTO): Promise<string> {
   //    return template;
   // }

   //  Como eh apenas um teste, usamos e retornamos apenas TEMPLATE.
   //  Isso nao faz nada, apenas atende os testes da aplicacao.
   // public async parse({ template }: IParseMailTemplateDTO): Promise<string> {
   //    return template;
   // }

   // como mudamos a interface IParseMailTemplateDTO para receber um ARQUIVO template
   // aqui nao recebemos nada, afinal aqui eh somente teste
   public async parse(): Promise<string> {
      return 'Mail content';
   }
}

export default FakeMailTemplateProvider;