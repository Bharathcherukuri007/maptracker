class Location{
	public longitude : number;
	public latitude: number;
	public timestamp: string;
	constructor(longitude: number, latitude : number, timestamp : string){
		this.latitude = latitude;
		this.longitude = longitude;
		this.timestamp = timestamp;

	}
}


export default Location;