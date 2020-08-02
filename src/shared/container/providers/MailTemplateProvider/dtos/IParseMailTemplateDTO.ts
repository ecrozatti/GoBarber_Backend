// Criamos essa interface para receber qualquer tipo/qtde de parametros
// eles podem ter qualquer nome, mas devem ser string ou number
interface ITemplateVariables {
   [key: string]: string | number;
}

// variables sera do tipo ITemplateVariables, entao pode receber N parametros.
export default interface IParseMailTemplateDTO {
   //template: string;
   // Ao inves de receber uma string com o conteudo, receberemos o arquivo template
   file: string;
   variables: ITemplateVariables;
}