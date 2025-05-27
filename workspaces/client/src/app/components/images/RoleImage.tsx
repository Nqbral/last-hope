import { Role } from '@last-hope/shared/classes/Role';
import { NAME_ROLE } from '@last-hope/shared/consts/NameRole';
import DoctorImg from '@public/doctor.png';
import InfectedImg from '@public/infected.png';
import Image from 'next/image';

type Props = {
  role: Role | undefined;
};

export default function RoleImage({ role }: Props) {
  if (role?.nameRole == NAME_ROLE.DOCTOR) {
    return (
      <Image
        src={DoctorImg}
        alt="doctor_img"
        className="w-20 sm:w-24 md:w-32"
      />
    );
  }

  if (role?.nameRole == NAME_ROLE.INFECTED) {
    return (
      <Image
        src={InfectedImg}
        alt="infected_img"
        className="w-20 sm:w-24 md:w-32"
      />
    );
  }

  return <></>;
}
