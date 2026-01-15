import FormLogin from '../../components/FormLogin';

// Page de connexion : ne fait que wrapper le formulaire
export default function Connexion() {
  return (
    <div>
      <h2>Connexion</h2>
      <FormLogin />
    </div>
  );
}
