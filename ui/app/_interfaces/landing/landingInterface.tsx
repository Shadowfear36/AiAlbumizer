export interface LandingFormInterface {
    email: string;
    username: string;
    password: string;
    isLogin: boolean;
  }

export interface RegisterFormProps {
    form: LandingFormInterface;
    setFormState: React.Dispatch<React.SetStateAction<LandingFormInterface>>;
}