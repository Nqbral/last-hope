import { Role } from '@last-hope/shared/classes/Role';
import DoctorImg from '@public/doctor.png';
import InfectedImg from '@public/infected.png';
import Image from 'next/image';

type Props = {
  role: Role | undefined;
};

export default function RoleImage({ role }: Props) {
  if (role?.nameRole == 'Docteur') {
    return <Image src={DoctorImg} alt="doctor_img" className="w-32" />;
  }

  if (role?.nameRole == 'Infecté') {
    return <Image src={InfectedImg} alt="infected_img" className="w-32" />;
  }

  return <></>;
}
