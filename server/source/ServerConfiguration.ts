module Exclusive {
	export module ServerConfiguration {
		export var HostName: string;
		export var Port: number;
		export var Protocol: string;
		export var DataLocalPath: string;
		export var AppPath: string;
		export var AuthorisationServer: string;
		export var AuthorisationPath: string;
		export function ReadServerConfigurations(): void {
			try {
				var configuration = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
				ServerConfiguration.HostName = configuration.hostName;
				ServerConfiguration.Port = configuration.port;
				ServerConfiguration.Protocol = configuration.protocol;
				ServerConfiguration.DataLocalPath = path.resolve(configuration.data, '');
				var absolutePath = path.resolve(configuration.build, '');
				ServerConfiguration.AppPath = path.join(absolutePath, 'app');
				ServerConfiguration.AuthorisationServer = configuration.authorisationServer;
				ServerConfiguration.AuthorisationPath = configuration.authorisationPath;
			}
			catch (Error) {
				console.log("There was an error while reading the configuration file, unable to continue.\n" + Error.toString());
				process.exit(1);
			}
		}
	}
}
