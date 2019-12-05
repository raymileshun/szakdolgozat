import java.io.IOException;

public class Application {


    public static void main(String[] args) throws IOException {
        //OldService oldService= new OldService();
        //service.parseHtml();
        Service service = new Service();
        service.downloadHardwareLists();
    }

}