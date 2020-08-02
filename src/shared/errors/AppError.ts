class AppError {
   // público para podermos acessar de fora da classe
   public readonly message: string;

   public readonly statusCode: number;

   // statusCode com valor default 400, caso não informado
   // dessa maneira, o TS já entende que é do tipo NUMBER.
   constructor(message: string, statusCode = 400) {
      this.message = message;
      this.statusCode = statusCode;
   }
}

export default AppError;
