export interface DireccionDTO {
  idDireccion?: number;       // opcional porque al crear no lo tiene
  idUsuario?: number;
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
}
