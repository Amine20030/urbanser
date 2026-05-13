package ma.urbanops.rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

/**
 * RMI remote interface — methods callable from another JVM.
 */
public interface AIAnalysisRemote extends Remote {

    String classifyIncident(String description, String categoryHint) throws RemoteException;

    String getSeverity(String description) throws RemoteException;

    String ping() throws RemoteException;
}
