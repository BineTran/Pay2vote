import { queryDB } from '@/utils/db';

export type FiService = {
	uuid: string;
	code: string;
	name: string;
	type: string;
	logo: string;
	fi_name: string;
	fi_full_name: string;
	fi_bin: number;
};
export const upsertFiServices = async (services: FiService[]) => {
	const sql = `
	  INSERT INTO fi_services (uuid, code, name, type, logo, fi_name, fi_full_name, fi_bin)
	  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	  ON DUPLICATE KEY UPDATE
	  code = VALUES(code),
	  name = VALUES(name),
	  type = VALUES(type),
	  logo = VALUES(logo),
	  fi_name = VALUES(fi_name),
	  fi_full_name = VALUES(fi_full_name),
	  fi_bin = VALUES(fi_bin)
	`;

	const promises = services.map((service) => {
		return queryDB(sql, [
			service.uuid,
			service.code,
			service.name,
			service.type,
			service.logo,
			service.fi_name,
			service.fi_full_name,
			service.fi_bin,
		]);
	});

	return Promise.all(promises);
};

export const getAllFiServices = async (): Promise<FiService[]> => {
	const sql = 'SELECT uuid, code, name, type, logo, fi_name, fi_full_name, fi_bin FROM fi_services ';
	const result = await queryDB(sql, []);
	return result;
};
